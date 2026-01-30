terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "tls_private_key" "agent_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "agent_keypair" {
  key_name   = "builder_instance_keypair"
  public_key = tls_private_key.agent_key.public_key_openssh
}

resource "aws_security_group" "ssh" {
  ingress {
    protocol    = "TCP"
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "builder_instance" {
  ami                    = "ami-0f9c27b471bdcd702"
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.agent_keypair.key_name
  vpc_security_group_ids = [aws_security_group.ssh.id]

  subnet_id = "subnet-0a1b2c3d4e5f67890"

  user_data = <<-EOF
#!/bin/bash

JENKINS_IP="18.212.123.45"
AGENT_SECRET="a9f3c2b7e8d4f1a0c6b5e9d2"
NODE_NAME="docker-builder"

apt-get update -y
apt-get install -y docker.io openjdk-21-jre curl

usermod -aG docker admin
systemctl enable docker
systemctl start docker

mkdir -p /home/admin/jenkins
cd /home/admin/jenkins

curl -O http://$JENKINS_IP:8080/jnlpJars/agent.jar
chown -R admin:admin /home/admin/jenkins

su - admin -c "java -jar /home/admin/jenkins/agent.jar \
  -url http://$JENKINS_IP:8080 \
  -secret $AGENT_SECRET \
  -name $NODE_NAME \
  -webSocket \
  -workDir /home/admin/jenkins &"
EOF

  tags = {
    Name = "docker-builder"
  }
}

output "public_ip" {
  value = aws_instance.builder_instance.public_ip
}

output "private_key_pem" {
  value     = tls_private_key.agent_key.private_key_pem
  sensitive = true
}

resource "local_file" "agent_private_key" {
  content         = tls_private_key.agent_key.private_key_pem
  filename        = "${path.module}/builder.pem"
  file_permission = "0600"
}