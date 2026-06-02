moves = [[-1,0],[1,0],[0,-1],[0,1]]
diagonal = [[1,1],[-1,1],[-1,-1],[1,-1]]

function sqKey(r, c) { return r * 8 + c; }

test = '{'

for (const [dr, dc] of moves){
    for (const A of [1,2]) {
        test+=`[${dr*A},${dc*A}]: [`

        for (const [ddr, ddc] of diagonal) {
            test+=`[${dr*A+ddr},${dc*A+ddc}], `
        }

        test+='], '
    }
}

test+= '}'

console.log(test)