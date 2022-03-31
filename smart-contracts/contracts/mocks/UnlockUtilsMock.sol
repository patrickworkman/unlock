// SPDX-License-Identifier: MIT
pragma solidity >=0.5.17 <=0.8.7;


import '../UnlockUtils.sol';

// For testing only.
contract UnlockUtilsMock
{
  using UnlockUtils for uint;
  using UnlockUtils for address;
  
  function uint2Str(
    uint _i
  ) public pure
    returns (string memory _uintAsString)
  {
    return _i.uint2Str();
  }

  function address2Str(
    address _addr
  ) public pure
    returns(string memory)
  {
    return _addr.address2Str();
  }
}