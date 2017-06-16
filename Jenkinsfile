def filename = 'manifest-${branch}.xml'

node ('master') {
       checkout changelog: false, poll: false, scm: [$class: 'RepoScm', currentBranch: true, manifestBranch: params.branch, manifestRepositoryUrl: 'https://gerrit.opencord.org/manifest', quiet: true]

       stage 'Generate and Copy Manifest file'
       sh returnStdout: true, script: 'repo manifest -r -o ' + filename
       sh returnStdout: true, script: 'cp ' + filename + ' ' + env.JENKINS_HOME + '/tmp'
}

timeout (time: 240) {
    node ("${targetVM}") {
       stage 'Checkout cord repo'
       checkout changelog: false, poll: false, scm: [$class: 'RepoScm', currentBranch: true, manifestBranch: params.branch, manifestRepositoryUrl: 'https://gerrit.opencord.org/manifest', quiet: true]

       dir('orchestration/xos-gui') {
            try {

                stage 'Install Node Modules'
                sh 'npm install'

                stage 'Check Code Style'
                sh 'npm run lint'

                stage 'Run Unit Tests'
                sh 'npm test'

                // stage 'Build GUI docker container'
                // sh 'docker pull nginx'
                // sh 'docker tag nginx nginx:candidate'
                // sh 'docker build --no-cache -t xosproject/xos-gui .'
                // sh 'docker run -p 4000:4000 --net=host --name xos-gui -d xosproject/xos-gui'
            } catch (err) {
                currentBuild.result = 'FAILURE'
                step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: 'teo@onlab.us', sendToIndividuals: true])
            }
       }
       dir('build/platform-install') {
            stage 'Build Mock R-CORD Config'
            sh 'ansible-playbook -i inventory/mock-rcord deploy-xos-playbook.yml'
       }
       dir('orchestration/xos-gui') {
            try {
                stage 'Run E2E Tests'
                sh 'UI_URL=127.0.0.1:4000/xos/# protractor conf/protractor.conf.js'
                currentBuild.result = 'SUCCESS'
            } catch (err) {
                currentBuild.result = 'FAILURE'
                step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: 'teo@onlab.us', sendToIndividuals: true])
            } finally {
               stage 'Cleanup'
               dir('build/platform-install') {
                    sh 'ansible-playbook -i inventory/mock-rcord teardown-playbook.yml'
                    sh """
                    docker rmi -f xosproject/xos-synchronizer-base:candidate || true
                    docker rmi -f xosproject/xos-client:candidate || true
                    docker rmi -f xosproject/xos-corebuilder:candidate || true
                    docker rmi -f xosproject/xos-ui:candidate || true
                    docker rmi -f xosproject/xos:candidate || true
                    docker rmi -f xosproject/gui-extension-sample:candidate || true
                    docker rmi -f xosproject/chameleon:candidate || true
                    """
                    echo "RESULT: ${currentBuild.result}"
               }
            }
       }
    }
}