pipeline {
    agent any

    environment {
        VIRTUAL_ENV = "${WORKSPACE}/venv"
        PATH = "${VIRTUAL_ENV}/bin:${env.PATH}"
    }

    stages {
        stage('Clone') {
            steps {
                script {
                    try {
                        git branch: 'main', url: 'https://github.com/Rouuufa/BarcodeScanning.git'
                        echo "Repository cloned successfully."
                    } catch (Exception e) {
                        error "Failed to clone repository: ${e.message}"
                    }
                }
            }
        }
        stage('Setup') {
            steps {
                script {
                    try {
                        sh 'python3 -m venv venv'
                        sh 'venv/bin/pip install --upgrade pip'
                        sh 'venv/bin/pip install -r requirements.txt'
                        sh 'venv/bin/pip install pytest'
                        sh 'venv/bin/pip install flake8'
                        echo "Virtual environment and dependencies set up successfully."
                    } catch (Exception e) {
                        error "Failed to set up virtual environment: ${e.message}"
                    }
                }
            }
        }
        stage('Lint') {
            steps {
                script {
                    try {
                        sh 'venv/bin/flake8 --jobs auto .' 
                        echo "Linting completed successfully."
                    } catch (Exception e) {
                        error "Linting failed: ${e.message}"
                    }
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: '**/*.log', allowEmptyArchive: true
        }

        success {
            script {
                mail to: "abderraoufkraiem@gmail.com", subject: "Jenkins Build Successful: ${env.JOB_NAME}", body: "Jenkins build successful: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'\n\nCheck console output at ${env.BUILD_URL}"
            }
        }

        failure {
            script {
                mail to: "abderraoufkraiem@gmail.com", subject: "Jenkins Build Failed: ${env.JOB_NAME}", body: "Jenkins build failed: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'\n\nCheck console output at ${env.BUILD_URL}"
            }
        }
    }
}
