import os
import sys
import json


root_dir = sys.argv[1]
extension = 'wav'


parts = {}

for filename in os.listdir(root_dir):
    name, ext = filename.split('.')
    if ext != extension:
        continue
    id_ = name.split('_')[0]
    if id_ not in parts:
        parts[id_] = []
    parts[id_].append(name)

out = json.dumps(parts)
print out
