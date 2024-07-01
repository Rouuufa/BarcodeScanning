from setuptools import setup, find_packages

setup(
    name='BarcodeScanning',
    version='1.0',
    packages=find_packages(),
    install_requires=open('requirements.txt').read().strip().split('\n'),
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
)
