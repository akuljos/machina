from sys import argv

dir         = argv[1]
patient     = dir.split('/')[-1]
infile      = dir + '/' + patient + '.labeling'
treefile    = dir + '/' + patient + '.tree'
outfile     = dir + '/' + patient + '.reported.labeling' 
V           = set()
labeldict   = {}

with open(infile) as f:
    lines = f.readlines()

with open(treefile) as g:
    edges = g.readlines()

for line in lines:
    k, v = line.split(' ')
    if v[-1] == '\n':
        v = v[:-1]
    labeldict[k] = v

for edge in edges:
    u, v = edge.split(' ')
    if v[-1] == '\n':
        v = v[:-1]
    V.add(u)
    V.add(v)

for v in V:
    if v not in labeldict:
        labeldict[v] = 'labeless'

with open(outfile, 'w') as h:
    for k, v in labeldict.items():
        print(k, v, file=h)
    #stdout = orig_stdout