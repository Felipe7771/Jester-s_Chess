import numpy as np

def criar_matriz():
    # Cria uma grade de coordenadas i e j
    a = 4
    b = 1
    q = 100
    i, j = np.ogrid[:8, :8]
    # Aplica a fórmula i^2 + j^2
    # matriz = (7-i)**2 + (-10)*(j-3)**2 + 110
    matriz = -4*( (i-3)*(i-4) + (j-3)*(j-4) ) + 100
    return matriz

m = criar_matriz()

for line in m:
    for item in line:
        print(f'{item:^10.2f}',end='')
    print()