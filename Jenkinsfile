pipeline {
    agent any

    environment {
        VIRTUAL_ENV = "${WORKSPACE}/venv"
        PATH = "${VIRTUAL_ENV}/bin:${env.PATH}"
    }

    stages {
        stage('Clone') {
            steps {
                // Clone the repository and specify the branch
                git branch: 'main', url: 'https://github.com/Rouuufa/BarcodeScanning.git'
            }
        }
        stage('Setup') {
            steps {
                // Set up Python virtual environment and install dependencies
                sh 'python3 -m venv venv'
                sh 'venv/bin/pip install --upgrade pip'
                sh 'venv/bin/pip install -r requirements.txt'
                sh 'venv/bin/pip install pylint'
                sh 'venv/bin/pip install pytest'
            }
        }
        stage('Lint') {
            steps {
                // Lint the codebase using flake8
                sh 'venv/bin/pylint .'
            }
        }
        stage('Test') {
            steps {
                // Run tests using pytest
                sh 'venv/bin/pytest test_barcode_scanner.py '
            }
        }
        stage('Package') {
            steps {
                // Package the application, if applicable
                // For example, create a distribution package
                sh 'venv/bin/python setup.py sdist'
            }
        }
    }
    post {
        always {
            // Archive logs and test results
            archiveArtifacts artifacts: '**/*.log', allowEmptyArchive: true
            junit 'reports/*.xml'
        }
    }
}
