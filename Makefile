up:
	docker compose up -d

down: 
	docker compose down

get-in:
	docker exec -it treinofofo bash

logs:
	docker compose logs

restart:
	docker compose restart treinofofo

rerestart:	
	docker compose down -v --rmi all ; docker compose up -d

upbuild:	
	docker compose down -v --rmi all ; docker compose up -d --build
