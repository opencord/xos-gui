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

                stage 'Build GUI docker container'
                sh 'docker build -t xosproject/xos-gui .'
                sh 'docker run -p 4000:4000 --net=host -d xosproject/xos-gui'
                sh 'curl 127.0.0.1:4000/spa/ --write-out %{http_code} --silent --output /dev/null | grep 200'

                currentBuild.result = 'SUCCESS'
            } catch (err) {
                currentBuild.result = 'FAILURE'
                step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: 'teo@onlab.us', sendToIndividuals: true])
            } finally {
                sh 'docker stop xos-gui'
                sh 'docker rm xos-gui'
                sh 'docker rmi xosproject/xos-gui'
            }
            echo "RESULT: ${currentBuild.result}"
       }

    }
}