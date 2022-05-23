const BigNumber = require('bignumber.js')

const Erc20Token = artifacts.require(
  '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20'
)

module.exports = async function getTokenBalance(account, tokenAddress) {
  if (tokenAddress === web3.utils.padLeft(0, 40)) {
    return new BigNumber(await web3.eth.getBalance(account))
  }
  return new BigNumber(
    await (await Erc20Token.at(tokenAddress)).balanceOf(account)
  )
}
