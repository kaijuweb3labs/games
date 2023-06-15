/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  KaijuGameFactory,
  KaijuGameFactoryInterface,
} from "../../types/game-2048/KaijuGameFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_dateTimeContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gameContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gameNFTContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "_gameID",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_randomNumber",
        type: "uint256",
      },
    ],
    name: "GetRandomNumber",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "_gameID",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_isValid",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_contractScore",
        type: "uint256",
      },
    ],
    name: "Verify2048Game",
    type: "event",
  },
  {
    inputs: [],
    name: "SINGAPORE_TIME_DIFF",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "string",
            name: "gameID",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct KaijuGameFactory.gameObject",
        name: "game",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "currentTimestamp",
        type: "uint256",
      },
    ],
    name: "addToLeaderBoard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "gameContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "gameIdToRandom",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDailyWinner",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "string",
            name: "gameID",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct KaijuGameFactory.gameObject",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLeaderBoard",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "string",
            name: "gameID",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct KaijuGameFactory.gameObject[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "year",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "month",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "day",
        type: "uint8",
      },
    ],
    name: "getLeaderBoardByDate",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "string",
            name: "gameID",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct KaijuGameFactory.gameObject[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getPersonalBest",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "getRandomNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "getYearMonthDate",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "isGameValid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "leaderBoardByDate",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "playerPersonalBest",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_contractAddress",
        type: "address",
      },
    ],
    name: "setGameContractAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_gameID",
        type: "string",
      },
      {
        internalType: "string",
        name: "_moves",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_score",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_cid",
        type: "string",
      },
    ],
    name: "verify2048game",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001fb938038062001fb98339810160408190526200003491620000a2565b60038054336001600160a01b0319918216179091556001805482166001600160a01b0395861617905560028054821692851692909217909155600080549091169190921617905542600455620000ec565b80516001600160a01b03811681146200009d57600080fd5b919050565b600080600060608486031215620000b857600080fd5b620000c38462000085565b9250620000d36020850162000085565b9150620000e36040850162000085565b90509250925092565b611ebd80620000fc6000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c80637d6b1b2a11610097578063cb15930d11610066578063cb15930d146102d2578063d305843c146102f2578063d3f3300914610305578063d88a48041461032557600080fd5b80637d6b1b2a146102525780638da5cb5b146102655780639b9413d5146102aa578063c29d72bc146102ca57600080fd5b80634fe815cd116100d35780634fe815cd146101bb5780636b2a95c9146101e657806377f08cd61461020657806379aecd791461021b57600080fd5b80630403563714610105578063165402f014610130578063312c586614610174578063443d2cfc1461017d575b600080fd5b6101186101133660046114ce565b61033a565b604051610127939291906115ce565b60405180910390f35b61016661013e366004611618565b73ffffffffffffffffffffffffffffffffffffffff1660009081526005602052604090205490565b604051908152602001610127565b61016661708081565b6101ab61018b366004611635565b805160208183018101805160088252928201919093012091525460ff1681565b6040519015158152602001610127565b6101666101c9366004611635565b805160208183018101805160078252928201919093012091525481565b6101f96101f4366004611691565b61069e565b6040516101279190611731565b610219610214366004611618565b610841565b005b61022e6102293660046117b1565b61092f565b6040805161ffff909416845260ff9283166020850152911690820152606001610127565b6102196102603660046117ca565b610b0b565b6003546102859073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610127565b6101666102b8366004611618565b60056020526000908152604090205481565b6101f9610f70565b6102e56102e036600461186a565b610fad565b60405161012791906118b3565b610166610300366004611635565b611052565b6000546102859073ffffffffffffffffffffffffffffffffffffffff1681565b61032d61113b565b60405161012791906118c6565b60008054604051606092918291339173ffffffffffffffffffffffffffffffffffffffff1690839082906386d19860908c908c908c9060079061037e9085906118d9565b908152604051908190036020018120547fffffffff0000000000000000000000000000000000000000000000000000000060e087901b1682526103c6949392916004016118f5565b6000604051808303816000875af11580156103e5573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820160405261042b919081019061195e565b905060008060008380602001905181019061044691906119c7565b91945092509050600061045b61708042611a56565b9050600060405180608001604052808973ffffffffffffffffffffffffffffffffffffffff168152602001868152602001848152602001838152509050836008866040516104a991906118d9565b90815260405190819003602001902080549115157fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff009092169190911790558315610587576104f78183610b0b565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d204c45e898e6040518363ffffffff1660e01b8152600401610554929190611a6f565b600060405180830381600087803b15801561056e57600080fd5b505af1158015610582573d6000803e3d6000fd5b505050505b60078560405161059791906118d9565b9081526020016040518091039020600090558361063a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f464520616e642042452073636f72657320617265206d69732d6d61746368696e60448201527f672e2e2e0000000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b8460405161064891906118d9565b60408051918290038220861515835260208301869052917f8a1497761589b14d19da2194f05495605d05d59871dda294dcaaaf43e9d77dab910160405180910390a250929d919c509a5098505050505050505050565b606060008484846040516020016106d19392919061ffff93909316835260ff918216602084015216604082015260600190565b604051602081830303815290604052905060006006826040516106f491906118d9565b9081526020016040518091039020805461070d90611a9e565b80601f016020809104026020016040519081016040528092919081815260200182805461073990611a9e565b80156107865780601f1061075b57610100808354040283529160200191610786565b820191906000526020600020905b81548152906001019060200180831161076957829003601f168201915b50505050509050600081511161081e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f4c6561646572626f617264206e6f7420666f756e6420666f722074686520737060448201527f65636966696564206461746500000000000000000000000000000000000000006064820152608401610631565b6000818060200190518101906108349190611af1565b93505050505b9392505050565b60035473ffffffffffffffffffffffffffffffffffffffff1633146108e8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f4f6e6c792074686520636f6e7472616374206f776e65722063616e2063616c6c60448201527f20746869732066756e6374696f6e2e00000000000000000000000000000000006064820152608401610631565b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b6001546040517f92d663130000000000000000000000000000000000000000000000000000000081526004810183905260009182918291829173ffffffffffffffffffffffffffffffffffffffff909116906392d6631390602401602060405180830381865afa1580156109a7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109cb9190611c2f565b6001546040517fa324ad240000000000000000000000000000000000000000000000000000000081526004810188905291925060009173ffffffffffffffffffffffffffffffffffffffff9091169063a324ad2490602401602060405180830381865afa158015610a40573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a649190611c4c565b6001546040517f65c728400000000000000000000000000000000000000000000000000000000081526004810189905291925060009173ffffffffffffffffffffffffffffffffffffffff909116906365c7284090602401602060405180830381865afa158015610ad9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610afd9190611c4c565b929791965091945092505050565b604080830151835173ffffffffffffffffffffffffffffffffffffffff166000908152600560205291909120541015610b6c57604080830151835173ffffffffffffffffffffffffffffffffffffffff166000908152600560205291909120555b6000806000610b7a8461092f565b6040805161ffff8516602082015260ff808516928201929092529082166060820152929550909350915060009060800160405160208183030381529060405290506000600682604051610bcd91906118d9565b90815260200160405180910390208054610be690611a9e565b80601f0160208091040260200160405190810160405280929190818152602001828054610c1290611a9e565b8015610c5f5780601f10610c3457610100808354040283529160200191610c5f565b820191906000526020600020905b815481529060010190602001808311610c4257829003601f168201915b505050505090506060600082511115610d7657600082806020019051810190610c889190611af1565b9050805167ffffffffffffffff811115610ca457610ca4611383565b604051908082528060200260200182016040528015610d1657816020015b610d036040518060800160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160008152602001600081525090565b815260200190600190039081610cc25790505b50915060005b8151811015610d6f57818181518110610d3757610d37611c69565b6020026020010151838281518110610d5157610d51611c69565b60200260200101819052508080610d6790611c98565b915050610d1c565b5050610de4565b6040805160008082526020820190925290610de0565b610dcd6040518060800160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160008152602001600081525090565b815260200190600190039081610d8c5790505b5090505b8051600a811015610f04576000610dfc826001611a56565b67ffffffffffffffff811115610e1457610e14611383565b604051908082528060200260200182016040528015610e8657816020015b610e736040518060800160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160008152602001600081525090565b815260200190600190039081610e325790505b50905060005b82811015610ede57838181518110610ea657610ea6611c69565b6020026020010151828281518110610ec057610ec0611c69565b60200260200101819052508080610ed690611c98565b915050610e8c565b5089818381518110610ef257610ef2611c69565b60209081029190910101529150610f4e565b886040015182600081518110610f1c57610f1c611c69565b6020026020010151604001511015610f4e578882600081518110610f4257610f42611c69565b60200260200101819052505b610f57826111bc565b9150610f65878787856112fa565b505050505050505050565b60606000610f8061708042611a56565b90506000806000610f908461092f565b9250925092506000610fa384848461069e565b9695505050505050565b805160208183018101805160068252928201919093012091528054610fd190611a9e565b80601f0160208091040260200160405190810160405280929190818152602001828054610ffd90611a9e565b801561104a5780601f1061101f5761010080835404028352916020019161104a565b820191906000526020600020905b81548152906001019060200180831161102d57829003601f168201915b505050505081565b600454600090611063600143611cd0565b4060405160200161107e929190918252602082015260400190565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152919052805160209091012060048190556000906110ca90620f424090611ce3565b9050806007846040516110dd91906118d9565b908152604051908190036020018120919091556110fb9084906118d9565b604051908190038120828252907ff00a9035d77900613cfbb31eb5d4a8a927ff33a676b51dfc02d529e062c5e9459060200160405180910390a292915050565b61117c6040518060800160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160008152602001600081525090565b6000611186610f70565b8051909150600082611199600184611cd0565b815181106111a9576111a9611c69565b6020026020010151905080935050505090565b805160609060005b6111cf600183611cd0565b8110156112f25760005b60016111e58385611cd0565b6111ef9190611cd0565b8110156112df5784611202826001611a56565b8151811061121257611212611c69565b60200260200101516040015185828151811061123057611230611c69565b60200260200101516040015111156112cd57600085828151811061125657611256611c69565b602002602001015190508582600161126e9190611a56565b8151811061127e5761127e611c69565b602002602001015186838151811061129857611298611c69565b602090810291909101015280866112b0846001611a56565b815181106112c0576112c0611c69565b6020026020010181905250505b806112d781611c98565b9150506111d9565b50806112ea81611c98565b9150506111c4565b509192915050565b6040805161ffff8616602082015260ff858116828401528416606080830191909152825180830390910181526080820190925260009061133e90849060a001611731565b60405160208183030381529060405290508060068360405161136091906118d9565b9081526020016040518091039020908161137a9190611d6d565b50505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516080810167ffffffffffffffff811182821017156113d5576113d5611383565b60405290565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff8111828210171561142257611422611383565b604052919050565b600067ffffffffffffffff82111561144457611444611383565b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b600061148361147e8461142a565b6113db565b905082815283838301111561149757600080fd5b828260208301376000602084830101529392505050565b600082601f8301126114bf57600080fd5b61083a83833560208501611470565b600080600080608085870312156114e457600080fd5b843567ffffffffffffffff808211156114fc57600080fd5b611508888389016114ae565b9550602087013591508082111561151e57600080fd5b61152a888389016114ae565b945060408701359350606087013591508082111561154757600080fd5b50611554878288016114ae565b91505092959194509250565b60005b8381101561157b578181015183820152602001611563565b50506000910152565b6000815180845261159c816020860160208601611560565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6060815260006115e16060830186611584565b93151560208301525060400152919050565b73ffffffffffffffffffffffffffffffffffffffff8116811461161557600080fd5b50565b60006020828403121561162a57600080fd5b813561083a816115f3565b60006020828403121561164757600080fd5b813567ffffffffffffffff81111561165e57600080fd5b61166a848285016114ae565b949350505050565b61ffff8116811461161557600080fd5b60ff8116811461161557600080fd5b6000806000606084860312156116a657600080fd5b83356116b181611672565b925060208401356116c181611682565b915060408401356116d181611682565b809150509250925092565b73ffffffffffffffffffffffffffffffffffffffff815116825260006020820151608060208501526117116080850182611584565b905060408301516040850152606083015160608501528091505092915050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b828110156117a4577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08886030184526117928583516116dc565b94509285019290850190600101611758565b5092979650505050505050565b6000602082840312156117c357600080fd5b5035919050565b600080604083850312156117dd57600080fd5b823567ffffffffffffffff808211156117f557600080fd5b908401906080828703121561180957600080fd5b6118116113b2565b823561181c816115f3565b815260208301358281111561183057600080fd5b61183c888286016114ae565b6020830152506040830135604082015260608301356060820152809450505050602083013590509250929050565b60006020828403121561187c57600080fd5b813567ffffffffffffffff81111561189357600080fd5b8201601f810184136118a457600080fd5b61166a84823560208401611470565b60208152600061083a6020830184611584565b60208152600061083a60208301846116dc565b600082516118eb818460208701611560565b9190910192915050565b6080815260006119086080830187611584565b828103602084015261191a8187611584565b604084019590955250506060015292915050565b600061193c61147e8461142a565b905082815283838301111561195057600080fd5b61083a836020830184611560565b60006020828403121561197057600080fd5b815167ffffffffffffffff81111561198757600080fd5b8201601f8101841361199857600080fd5b61166a8482516020840161192e565b600082601f8301126119b857600080fd5b61083a8383516020850161192e565b6000806000606084860312156119dc57600080fd5b835167ffffffffffffffff8111156119f357600080fd5b6119ff868287016119a7565b93505060208401518015158114611a1557600080fd5b80925050604084015190509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b80820180821115611a6957611a69611a27565b92915050565b73ffffffffffffffffffffffffffffffffffffffff8316815260406020820152600061166a6040830184611584565b600181811c90821680611ab257607f821691505b602082108103611aeb577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b60006020808385031215611b0457600080fd5b825167ffffffffffffffff80821115611b1c57600080fd5b818501915085601f830112611b3057600080fd5b815181811115611b4257611b42611383565b8060051b611b518582016113db565b9182528381018501918581019089841115611b6b57600080fd5b86860192505b83831015611c2257825185811115611b895760008081fd5b86016080818c037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe001811315611bbf5760008081fd5b611bc76113b2565b89830151611bd4816115f3565b815260408381015189811115611bea5760008081fd5b611bf88f8d838801016119a7565b838d0152506060848101519183019190915291909201519082015282529186019190860190611b71565b9998505050505050505050565b600060208284031215611c4157600080fd5b815161083a81611672565b600060208284031215611c5e57600080fd5b815161083a81611682565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611cc957611cc9611a27565b5060010190565b81810381811115611a6957611a69611a27565b600082611d19577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500690565b601f821115611d6857600081815260208120601f850160051c81016020861015611d455750805b601f850160051c820191505b81811015611d6457828155600101611d51565b5050505b505050565b815167ffffffffffffffff811115611d8757611d87611383565b611d9b81611d958454611a9e565b84611d1e565b602080601f831160018114611dee5760008415611db85750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555611d64565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b82811015611e3b57888601518255948401946001909101908401611e1c565b5085821015611e7757878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b0190555056fea26469706673582212208ab8ab62e510f8eb5e03ffafec4baa625104e1285d9e804e9caf6567d9f66ea564736f6c63430008130033";

type KaijuGameFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: KaijuGameFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class KaijuGameFactory__factory extends ContractFactory {
  constructor(...args: KaijuGameFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _dateTimeContract: PromiseOrValue<string>,
    _gameContract: PromiseOrValue<string>,
    _gameNFTContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<KaijuGameFactory> {
    return super.deploy(
      _dateTimeContract,
      _gameContract,
      _gameNFTContract,
      overrides || {}
    ) as Promise<KaijuGameFactory>;
  }
  override getDeployTransaction(
    _dateTimeContract: PromiseOrValue<string>,
    _gameContract: PromiseOrValue<string>,
    _gameNFTContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _dateTimeContract,
      _gameContract,
      _gameNFTContract,
      overrides || {}
    );
  }
  override attach(address: string): KaijuGameFactory {
    return super.attach(address) as KaijuGameFactory;
  }
  override connect(signer: Signer): KaijuGameFactory__factory {
    return super.connect(signer) as KaijuGameFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): KaijuGameFactoryInterface {
    return new utils.Interface(_abi) as KaijuGameFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): KaijuGameFactory {
    return new Contract(address, _abi, signerOrProvider) as KaijuGameFactory;
  }
}
