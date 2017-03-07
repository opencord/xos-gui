const debug = false;
const nodeSize = 200;
const nodeSpacing = 400;

export const XosGraphConfig = {
  debug: debug,
  nodes: {
    size: nodeSize,
    spacing: nodeSpacing,
    material: {
      color: '#f6a821',
      wireframe: debug
    }
  },
  links: {
    radius: 10,
    material: {
      color: '#f68209',
      wireframe: debug
    }
  },
  camera: {
    position: {
      z: (nodeSize + nodeSpacing) * 2.5
    }
  }
};
