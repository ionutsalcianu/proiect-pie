pragma solidity ^0.5.9;

contract Coupon {
    // The keyword "public" makes those variables
    // readable from outside.
    address constant admin = 0x918e3947e1A3D97BEfc3F51Bd8b31416bbdAD5F9;
    mapping (address => HistoryRecord) public balances;
    HistoryRecord[] public historyRecords;

    function createUserHistory(address user) public{
        checkAdminPermission();
        historyRecords.push(HistoryRecord({
            incidentTime : now ,
            owner : user ,
            points : 0 ,
            activeCoupons : 0 ,
            totalCoupons : 0
        }));
        balances[user] = historyRecords[historyRecords.length - 1];
    }
    
     function updateUserHistory(address user, 
     uint points,
     uint activeCoupons,
     uint totalCoupons
     ) private{
        checkAdminPermission();
        historyRecords.push(HistoryRecord({
            incidentTime : now ,
            owner : user ,
            points : points ,
            activeCoupons : activeCoupons ,
            totalCoupons : totalCoupons
        }));
        balances[user] = historyRecords[historyRecords.length - 1];
    }
    
     function getUserHistory(address user) public 
     view returns( uint256[] memory,
        address[] memory,
        uint[] memory,
        uint[] memory,
        uint[] memory)
     {
        checkAdminPermission();
         uint k=0;
         for(uint i=0 ; i < historyRecords.length ; i++ ){
            if(historyRecords[i].owner == user){
                k++;
            }
         }
            
        uint256[] memory  incidentTime = new uint256[](k);
        address[] memory  owner  = new address[](k);
        uint[] memory points = new uint[](k);
        uint[] memory activeCoupons = new uint[](k);
        uint[] memory totalCoupons = new uint[](k);
        k=0;
        for(uint i=0 ; i < historyRecords.length ; i++ ){
            if(historyRecords[i].owner == user){
                incidentTime[k] = historyRecords[i].incidentTime;
                owner[k] = historyRecords[i].owner;
                points[k] = historyRecords[i].points;
                activeCoupons[k] = historyRecords[i].activeCoupons;
                totalCoupons[k] = historyRecords[i].totalCoupons;
                k++;
            }
        }
        return (incidentTime, owner,points,activeCoupons,totalCoupons);
    }

    function addPoints(address user, uint amount) public  {
        checkAdminPermission();
        uint sum = balances[user].points + amount;
        if(sum >= 10) {
            updateUserHistory(user,
                sum % 10,
                balances[user].activeCoupons + sum / 10,
                balances[user].totalCoupons + sum / 10
            );
        } else {
             updateUserHistory(user,
                balances[user].points + amount ,
                balances[user].activeCoupons ,
                balances[user].totalCoupons 
            );
        }
    }
    
    function useCoupon(address user) public {
        checkAdminPermission();
        if(balances[user].activeCoupons > 0) {
            updateUserHistory(user,
                balances[user].points,
                balances[user].activeCoupons - 1,
                balances[user].totalCoupons
            );
        }else{
            revert();
        }
    }
    
    struct HistoryRecord {
        uint256 incidentTime;
        address owner;
        uint points;
        uint activeCoupons;
        uint totalCoupons;
    }
    
    function checkAdminPermission() private view {
        if (msg.sender != admin) {
            revert();
        }
    }
}
