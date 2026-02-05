provider "aws" {
  region = "eu-north-1"
}


resource "aws_instance" "app" {
  ami           = "ami-073130f74f5ffb161"   # Ubuntu AMI
  instance_type = "t3.small"
  key_name      = "devops_keypair"

  tags = {
    Name = "App-EC2"
  }
}

output "app_ec2_public_ip" {
  description = "Public IP of App EC2"
  value       = aws_instance.app.public_ip
}
