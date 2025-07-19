terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.100"
    }
  }
  required_version = ">= 1.0"
}

# Configure the Yandex Cloud Provider
# provider "yandex" {
#   token     = var.yc_token
#   cloud_id  = var.yc_cloud_id
#   folder_id = var.yc_folder_id
#   zone      = var.yc_zone
# }

# Data source for Ubuntu 24.04 image
data "yandex_compute_image" "ubuntu" {
  family = "ubuntu-2404-lts"
}

# Create VPC network
resource "yandex_vpc_network" "network" {
  name = "fuckupboard-network"
}

# Create subnet
resource "yandex_vpc_subnet" "subnet" {
  name           = "fuckupboard-subnet"
  network_id     = yandex_vpc_network.network.id
  v4_cidr_blocks = ["192.168.10.0/24"]
  zone           = "ru-central1-a"
}

# Create security group
resource "yandex_vpc_security_group" "sg" {
  name        = "fuckupboard-sg"
  description = "Security group for fuckupboard application"
  network_id  = yandex_vpc_network.network.id

  ingress {
    protocol       = "TCP"
    description    = "SSH access"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 22
  }

  ingress {
    protocol       = "TCP"
    description    = "HTTP access"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 80
  }

  ingress {
    protocol       = "TCP"
    description    = "HTTPS access"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 443
  }

  ingress {
    protocol       = "TCP"
    description    = "HTTP access"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 8080
  }

  egress {
    protocol       = "ANY"
    description    = "Allow all outbound traffic"
    v4_cidr_blocks = ["0.0.0.0/0"]
    from_port      = 0
    to_port        = 65535
  }
}

# Create VM instance
resource "yandex_compute_instance" "vm" {
  name        = "fuckupboard-server"
  description = "Fuckupboard application server"
  platform_id = "standard-v3"
  zone        = "ru-central1-a"

  # Use the cheapest instance type
  resources {
    cores         = 2
    memory        = 2
    core_fraction = 20  # 5% of vCPU for cost optimization
  }

  boot_disk {
    initialize_params {
      image_id = data.yandex_compute_image.ubuntu.id
      size     = 10  # 10 GB disk
      type     = "network-hdd"  # Cheaper than SSD
    }
  }

  network_interface {
    subnet_id          = yandex_vpc_subnet.subnet.id
    security_group_ids = [yandex_vpc_security_group.sg.id]
    nat               = true  # Enable public IP
  }

  metadata = {
    ssh-keys = "ubuntu:${file("${path.module}/../fuckupboard-deployment.pub")}"
  }

  scheduling_policy {
    preemptible = true  # Use preemptible instances for cost savings
  }
}

# Output the public IP
output "public_ip" {
  value = yandex_compute_instance.vm.network_interface[0].nat_ip_address
}

# Output the SSH command
output "ssh_command" {
  value = "ssh -i fuckupboard-deployment ubuntu@${yandex_compute_instance.vm.network_interface[0].nat_ip_address}"
} 
