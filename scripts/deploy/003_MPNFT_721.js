async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('');
        }, ms)
    });
}

async function main() {
    const { deploy } = deployments;
    const [ deployer ] = await ethers.getSigners();

    console.log('deployer is ', deployer.address)

    // Construction parameters
    const params = [
    ];

    // deploy
    const mpToken = await deploy('MP', {
       from: deployer.address,
       args: params,
        log: true,
    }).then(s => ethers.getContractAt(s.abi, s.address, deployer));

    console.log('1. V2 MP has deployed at:', mpToken.address);

    console.log('    wait MP deployed, it will token one minute or more，Please be patient ');

    await mpToken.deployed();

    let waitTime = 1; // 30 s wait scan indexed
    for (var i = 0; i< waitTime; i++){
        await sleep(1000);
        if ( i%3 == 0) {
            console.log('  wait deploy completed after', waitTime - i, " s");
        }
    }

    // verify
    await run("verify:verify", {
        address: mpToken.address,
        constructorArguments: params
    });

    console.log('2. V2 MP has verifyed');
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
