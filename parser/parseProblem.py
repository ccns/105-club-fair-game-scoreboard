import json

f = open('problems.ctc', 'r')
types = {}
problems = {}
typenow = 0
for line in f:
    line = line.replace("\n","")
    if(line.find("    ") == 0):
        l = line[4:].split(". ")
        problems[typenow][l[0]] = l[1]
    else:
        l = line.split(". ")
        typenow = l[0]
        types[typenow] = l[1]
        problems[typenow] = {}

# print(types)
# print(problems)

with open('problems.json', 'w') as outfile:
    json.dump({'type': types, 'problem': problems}, outfile)
