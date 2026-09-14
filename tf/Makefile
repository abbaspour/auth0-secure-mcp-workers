PLAN_FILE=mcp.plan

LOG_LEVEL=''
TF=terraform

main: plan

plan:
	@TF_LOG=$(LOG_LEVEL) $(TF) plan -out $(PLAN_FILE)

apply:
	@TF_LOG=$(LOG_LEVEL) $(TF) apply -auto-approve $(PLAN_FILE)

output:
	$(TF) output

show:
	$(TF) show

refresh:
	$(TF) refresh

validate:
	$(TF) validate

clean:
	mv $(PLAN_FILE) /tmp

lint:
	tflint

init:
	terraform init -input=false -upgrade

graph:
	$(TF) graph > graph.dot
	dot -Tsvg graph.dot -o graph.svg

.PHONY: clean plan
