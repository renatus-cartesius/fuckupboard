# Terraform Infrastructure for Fuckupboard

This directory contains Terraform configuration to provision infrastructure in Yandex Cloud for the Fuckupboard application.

## Prerequisites

1. **Terraform** installed (version >= 1.0)
2. **Yandex Cloud account** with access to create resources
3. **SSH key pair** (already exists as `fuckupboard-deployment` and `fuckupboard-deployment.pub`)

## Setup Instructions

### 1. Get Yandex Cloud Credentials

You need to obtain the following from your Yandex Cloud console:

- **OAuth Token**: Generate in Yandex Cloud console
- **Cloud ID**: Found in the cloud overview
- **Folder ID**: Found in the folder overview

### 2. Configure Variables

```bash
# Copy the example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

Fill in your actual values:
```hcl
yc_token     = "your-actual-oauth-token"
yc_cloud_id  = "your-actual-cloud-id"
yc_folder_id = "your-actual-folder-id"
yc_zone      = "ru-central1-a"  # Optional
```

### 3. Initialize Terraform

```bash
cd terraform
terraform init
```

### 4. Review the Plan

```bash
terraform plan
```

### 5. Apply the Configuration

```bash
terraform apply
```

## Infrastructure Created

- **VPC Network**: `fuckupboard-network`
- **Subnet**: `fuckupboard-subnet` (192.168.10.0/24)
- **Security Group**: Allows SSH (22), HTTP (80), HTTPS (443)
- **VM Instance**: Ubuntu 24.04 LTS with minimal resources for cost optimization

## Cost Optimization Features

- **Preemptible Instance**: Up to 70% cost savings (may be terminated)
- **Core Fraction**: 5% of vCPU (suitable for light workloads)
- **Network HDD**: Cheaper than SSD for boot disk
- **Minimal Resources**: 1 vCPU, 1 GB RAM, 10 GB disk

## Outputs

After successful deployment, Terraform will output:

- **Public IP**: The server's public IP address
- **SSH Command**: Ready-to-use SSH command to connect

## Connecting to the Server

```bash
# Use the output from terraform apply
ssh -i fuckupboard-deployment ubuntu@<public-ip>
```

## Cleanup

To destroy all created resources:

```bash
terraform destroy
```

## Security Notes

- The security group allows SSH access from anywhere (0.0.0.0/0)
- Consider restricting SSH access to your IP address for production
- The public key is automatically installed for the `ubuntu` user 