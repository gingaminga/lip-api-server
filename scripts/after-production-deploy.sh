#!/bin/bash
ROOT_REPOSITORY=/home/ubuntu
BASE_REPOSITORY=/lip-api-server

# move directory
cd $ROOT_REPOSITORY$BASE_REPOSITORY

# start service
pm2 start ecosystem.config.js