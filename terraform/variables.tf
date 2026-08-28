variable "cluster_name" {
  type    = string
  default = "devops-atividade"
}

variable "node_count" {
  type    = number
  default = 1
}

variable "kubeconfig_path" {
  type    = string
  default = "./kubeconfig"
}

variable "k3d_wait" {
  type    = bool
  default = true
}
