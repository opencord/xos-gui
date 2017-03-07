import * as _ from 'lodash';
import {IXosCoarseGraphData, IXosServiceModel, IXosTenantModel} from '../../interfaces';
import {XosGraphConfig} from '../config';
export interface IGraphPositionerService {
  position(data: IXosCoarseGraphData): any;
}

export class GraphPositionerService implements IGraphPositionerService {

  static $inject = [
    '$log'
  ];

  constructor(
    private $log: ng.ILogService
  ) {

  }

  public position(data: IXosCoarseGraphData): any {
    // get the service chain
    let nodes = this.getServiceChains(angular.copy(data.services), angular.copy(data.tenants));

    nodes.chains = _.map(nodes.chains, (chain, v) => {
      return _.map(chain, (node, i) => {
        node.position = {
          x: (XosGraphConfig.nodes.size + XosGraphConfig.nodes.spacing) * i,
          y: (XosGraphConfig.nodes.size + XosGraphConfig.nodes.spacing) * - v,
        };
        return node;
      });
    });

    // NOTE maybe is better to randomly position spare nodes, now they looks part of their own chain
    nodes.spares = _.map(nodes.spares, (node, i) => {
      node.position = {
        x: (XosGraphConfig.nodes.size + XosGraphConfig.nodes.spacing) * i,
        y: (XosGraphConfig.nodes.size + XosGraphConfig.nodes.spacing),
        z: -XosGraphConfig.nodes.size
      };
      return node;
    });

    // flatten nodes
    nodes.chains = _.flatten(nodes.chains);
    nodes = _.concat(nodes.chains, nodes.spares);

    // position links
    let links = this.positionLinks(angular.copy(data.tenants), nodes);

    return {
      nodes,
      links
    };
  }

  private getServiceChains(services: IXosServiceModel[], tenants: IXosTenantModel[]): any {
    const chains = [];

    // build chain (untill we have tenants)
    while (tenants.length > 0) {
      const chain = this.buildChain(services, tenants);
      chains.push(chain);
    }

    this.$log.log('remaining tenants', tenants);
    this.$log.log('remaining services', services);

    return {
      chains,
      spares: services
    };
  }

  private buildChain(services: IXosServiceModel[], tenants: IXosTenantModel[]) {
    const minProviderServiceTenant = _.minBy(tenants, 'provider_service_id');
    const chain = this.followChain([_.find(services, {id: minProviderServiceTenant.provider_service_id})], services, tenants);
    _.remove(services, {id: minProviderServiceTenant.provider_service_id});
    return chain;
  }

  private followChain(chain: IXosServiceModel[], services: IXosServiceModel[], tenants: IXosTenantModel[]): IXosServiceModel[] {
    // find the tenant that depart from the first service
    const tenant = _.find(tenants, {provider_service_id: chain[chain.length - 1].id});
    if (!tenant) {
      // reversing the array to have the correct chain order
      return chain.reverse();
    }

    // remove the followed tenant
    _.remove(tenants, {id: tenant.id});

    // add the target service to the chain
    chain.push(_.find(services, {id: tenant.subscriber_service_id}));

    // remove the service
    _.remove(services, {id: tenant.subscriber_service_id})
    return this.followChain(chain, services, tenants);
  }

  private positionLinks(tenants: IXosTenantModel[], nodes: any[]) {
    return _.map(tenants, (tenant) => {
      const sourceNode = _.find(nodes, {id: tenant.provider_service_id});
      const targetNode = _.find(nodes, {id: tenant.subscriber_service_id});
      tenant.source = {
        x: sourceNode.position.x, // sourceNode.x - sourceNode.width
        y: sourceNode.position.y,
        z: sourceNode.position.z
      };

      tenant.target = {
        x: targetNode.position.x,
        y: targetNode.position.y,
        z: targetNode.position.z
      };

      return tenant;
    });
  }
}
