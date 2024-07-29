# Start project api
yarn workspace api run start:dev



# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
sudo docker network create app_network

# Build prod using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 sudo docker-compose -f docker-compose.yml build

# Start prod in detached mode
sudo docker-compose -f docker-compose.yml up -d

# Stop all running containers
sudo docker kill $(docker ps -q) && docker rm $(docker ps -a -q)