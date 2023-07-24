#!/bin/bash
REPOSITORY=/home/ubuntu/lip-api-server

cd $REPOSITORY

pm2 start ecosystem.config.js