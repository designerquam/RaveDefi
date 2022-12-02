const main = async () => {
  const Splitter = await hre.ethers.getContractFactory("splitter");
  const splitter = await Splitter.deploy();

  await splitter.deployed();

  console.log(`Ravedefi is deployed to:, ${splitter.address}`);
}


const runMain = async() => {
  try {
    await main();
    process.exit(0);
  } catch (error){
    console.error(error)
    process.exit(1);
  }
}

runMain();