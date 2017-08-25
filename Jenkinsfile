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
            } catch (err) {
                currentBuild.result = 'FAILURE'
                step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: 'teo@onlab.us', sendToIndividuals: true])
            }
       }
       dir('build') {
            stage 'Build Mock R-CORD Config'
            sh 'make PODCONFIG=rcord-local.yml config'
            sh 'make build'
       }
       dir('orchestration/xos-gui') {
            try {
                stage 'Run E2E Tests'
                sh 'UI_URL=127.0.0.1:4000/xos/# npm run test:e2e'
                currentBuild.result = 'SUCCESS'
            } catch (err) {
                currentBuild.result = 'FAILURE'
                step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: 'teo@onlab.us', sendToIndividuals: true])
            } finally {
               stage 'Cleanup'
               dir('build') {
                    sh 'make clean-local'
                    sh 'make clean-genconfig'
                    echo "RESULT: ${currentBuild.result}"
               }
            }
       }
    }
}