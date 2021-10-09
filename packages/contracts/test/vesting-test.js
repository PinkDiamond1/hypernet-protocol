const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("Vesting", function () {
    let hypertoken;
    let vester;
    let owner;
    let addr1; 

    let startTime;
    let cliffTime;
    let endTime;

    const award = ethers.utils.parseEther("100");

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();

        const latestBlock = await hre.ethers.provider.getBlock("latest");
        const timeNow = latestBlock.timestamp;
        startTime = timeNow+10; 
        cliffTime = timeNow+30;
        endTime = timeNow+60; 

        // deploy hypertoken contract
        const Hypertoken = await ethers.getContractFactory("Hypertoken");
        hypertoken = await Hypertoken.deploy();
        await hypertoken.deployTransaction.wait();

        // deploy Vesting contract
        const Vester = await ethers.getContractFactory("Vester");
        vester = await Vester.deploy(hypertoken.address, addr1.address, award, startTime, cliffTime, endTime);
        await vester.deployTransaction.wait();

        let tx = await hypertoken.transfer(vester.address, award);
        tx.wait();
	});

    it("Check vesting parameters.", async function () {

        let tx = await vester.connect(addr1).delegate(addr1.address);
        tx.wait();

        let asdf = await vester.vestingBegin();
        let qwer = await vester.vestingCliff();
        console.log(startTime)
        console.log(asdf.toString());
        console.log(qwer.toString());
        console.log()

        expect(await vester.vestingAmount()).to.equal(award);
        expect(await vester.vestingBegin()).to.equal(startTime);
        expect(await vester.vestingCliff()).to.equal(cliffTime);
        expect(await vester.vestingEnd()).to.equal(endTime);
        expect(await vester.recipient()).to.equal(addr1.address);
        expect(await hypertoken.balanceOf(vester.address)).to.equal(award);
        expect(await hypertoken.getVotes(addr1.address)).to.equal(award);
    });

    it("Check for full withdrawal.", async function () {
        let tx = await vester.connect(addr1).delegate(addr1.address);
        tx.wait();

        let a = await vester.timeNow();
        hre.timeAndMine.setTimeIncrease("1d");
        hre.timeAndMine.mine("100");
        let b = await vester.timeNow();
        console.log(a.toString())
        console.log(b.toString())

        tx = await vester.connect(addr1).claim(); 
        tx.wait();
        expect(await hypertoken.balanceOf(addr1.address)).to.equal(award);
    });
});