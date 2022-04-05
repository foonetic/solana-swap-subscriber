import { Connection } from "@solana/web3.js";
import { getOrca, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";

const main = async () => {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "singleGossip");
    const orca = getOrca(connection);

    // Note that in a typical trading application you would want to use your own
    // validator and remove the rate limit. Throttle down for this demo.
    setInterval(async () => {
        const pool = orca.getPool(OrcaPoolConfig.SOL_USDC);
        const solToken = pool.getTokenA();
        const usdToken = pool.getTokenB();

        let smallBuy = await pool.getQuote(usdToken, new Decimal(1000));
        let mediumBuy = await pool.getQuote(usdToken, new Decimal(10000));
        let largeBuy = await pool.getQuote(usdToken, new Decimal(100000));

        let smallSell = await pool.getQuote(solToken, new Decimal(0.1));
        let mediumSell = await pool.getQuote(solToken, new Decimal(1.0));
        let largeSell = await pool.getQuote(solToken, new Decimal(10.0));

        console.log(new Date().toLocaleTimeString());
        console.log(
            `Sell 0.1 SOL average px = $${smallSell.getMinOutputAmount().toNumber() * 10}`);
        console.log(
            `Sell 1.0 SOL average px = $${mediumSell.getMinOutputAmount().toNumber()}`);
        console.log(
            `Sell 10.0 SOL average px = $${largeSell.getMinOutputAmount().toNumber() / 10}`);

        console.log(
            `Buy $1000   SOL average px = $${1000 / smallBuy.getMinOutputAmount().toNumber()}`);
        console.log(
            `Buy $10000  SOL average px = $${10000 / mediumBuy.getMinOutputAmount().toNumber()}`);
        console.log(
            `Buy $100000 SOL average px = $${100000 / largeBuy.getMinOutputAmount().toNumber()}`);
    }, /*milliseconds=*/5000);

};

main();