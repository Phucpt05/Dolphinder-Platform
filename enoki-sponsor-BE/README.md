# Flow for sponsored transaction

1. create tx - frontend

2. build - frontend

3. create - /api/sponsor-transaction, enokiClient.createSponsoredTransaction -> bytes

4. sign - frontend, signTransaction -> signature

5. execute - /api/execute-transaction, enokiClient.executeSponsoredTransaction
