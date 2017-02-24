import json

f = open('problems.ctc', 'r')
problems = []
for line in f:
    line = line.replace("\n","")
    cols = line.split(":")
    print(cols)
    problems.append({"type": cols[0], "typeName": cols[1],
                    "no": cols[2], "title": cols[3],
                    "score": cols[4], "flag": cols[5], "solved": 0})

# print(types)
# print(problems)

with open('problems.json', 'w') as outfile:
    json.dump(problems, outfile)
