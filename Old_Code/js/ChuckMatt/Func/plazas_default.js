function plazaPawns(color) {

    if (color == 'w') {
  return Array.from({ length: 8 }, (_, i) => 
    Array.from({ length: 8 }, (_, j) => 2*(7-i)**2 + (5*(j-3)*(j-4) + 100))
  );
} else {
      return Array.from({ length: 8 }, (_, i) => 
    Array.from({ length: 8 }, (_, j) => 2*(i)**2 + (5*(j-3)*(j-4) + 100))
  );
}
} 

function plazaDefenders() {

  return Array.from({ length: 8 }, (_, i) => 
    Array.from({ length: 8 }, (_, j) => 4 * (i ** 2 - 7 * i + j ** 2 - 7 * j) + 100)
  );
}

function plazaDefaultAttackers() {

  return Array.from({ length: 8 }, (_, i) => 
    Array.from({ length: 8 }, (_, j) => -4*( (i-3)*(i-4) + (j-3)*(j-4) ) + 100)
  );
}

function plazaEnemyKing(Kr, Kc) {

  return Array.from({ length: 8 }, (_, i) => 
    Array.from({ length: 8 }, (_, j) => -2*( (i-Kr)**2 + (j-Kc)**2 ) + 100)
  );
}