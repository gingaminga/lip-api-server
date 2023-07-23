#!/bin/bash
REPOSITORY=/home/ubuntu/lip-api-server

cd $REPOSITORY

sudo pm2 start ecosystem.config.json