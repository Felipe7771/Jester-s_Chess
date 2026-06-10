import numpy as np

def criar_matriz():
    # Cria uma grade de coordenadas i e j
    r = 0
    c = 0
    q = 100
    i, j = np.ogrid[:8, :8]
    # Aplica a fórmula i^2 + j^2
    # matriz = (7-i)**2 + (-10)*(j-3)**2 + 110
    matriz = -2*( (r-i)**2 + (c-j)**2 ) + 100
    return matriz

m = criar_matriz()

for line in m:
    for item in line:
        print(f'{item:^5d}',end='')
    print()