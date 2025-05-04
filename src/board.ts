import { BoardState, PlayerState } from "@shared/types";

export const board: BoardState = {
    'ImperialBasin': {
        agentIcon: 'spice_trade',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'spice',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'HaggaBasin': {
        agentIcon: 'spice_trade',
        playerAgents: [],
        options: [
            {
                cost: {
                    water: 1,
                },
                rewards: [
                    {
                        type: 'chooseOne',
                        options: [
                            {
                                type: 'gain',
                                resource: 'spice',
                                amount: 2,
                            },
                            {
                                type: 'if',
                                condition: {
                                    check: 'hasHook',
                                    value: 1,
                                },
                                then: [
                                    {
                                        type: 'gain',
                                        resource: 'sandworm',
                                        amount: 1,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'DeepDesert': {
        agentIcon: 'spice_trade',
        playerAgents: [],
        options: [
            {
                cost: {
                    water: 3,
                },
                rewards: [
                {
                    type: 'chooseOne',
                    options: [
                        {
                            type: 'gain',
                            resource: 'spice',
                            amount: 4,
                        },
                        {
                            type: 'if',
                            condition: {
                                check: 'hasHook',
                                value: 1,
                            },
                            then: [
                                {
                                    type: 'gain',
                                    resource: 'sandworm',
                                    amount: 2,
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        ]
    },
    'Arrakeen': {
        agentIcon: 'city',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'troop',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'card',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'ResearchStation': {
        agentIcon: 'city',
        playerAgents: [],
        options: [
            {
                cost: {
                    water: 2,
                },
                rewards: [
                    {
                        type: 'gain',
                        resource: 'troop',
                        amount: 2,
                    },
                    {
                        type: 'gain',
                        resource: 'card',
                        amount: 2,
                    }
                ]
            }
        ]
    },
    'SpiceRefinery': {
        agentIcon: 'city',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'solari',
                        amount: 2,
                    },
                ]
            },
            {
                cost: {
                    spice: 1,
                },
                rewards: [
                    {
                        type: 'gain',
                        resource: 'solari',
                        amount: 4,
                    }
                ]
            }
        ]
    },
    'SietchTabr': {
        agentIcon: 'city',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'if',
                        condition: {
                            check: 'influenceAtLeast',
                            faction: 'fremen',
                            value: 2,
                        },
                        then: [
                            {
                                type: 'gain',
                                resource: 'water',
                                amount: 1,
                            },
                            {
                                type: 'gain',
                                resource: 'troop',
                                amount: 1,
                            },
                            {
                                type: 'gain',
                                resource: 'hook',
                                amount: 1,
                            }
                        ]
                    }
                ]
            },
            {
                rewards: [
                    {
                        type: 'if',
                        condition: {
                            check: 'influenceAtLeast',
                            faction: 'fremen',
                            value: 2,
                        },
                        then: [
                            {
                                type: 'gain',
                                resource: 'water',
                                amount: 1,
                            },
                            {
                                type: 'gain',
                                resource: 'breakWall',
                                amount: 1,
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'Fremkit': {
        agentIcon: 'fremen',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'card',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'influence',
                        faction: 'fremen',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'DesertTactics': {
        agentIcon: 'fremen',
        playerAgents: [],
        options: [
            {
                cost: {
                    water: 1,
                },
                rewards: [
                    {
                        type: 'gain',
                        resource: 'troop',
                        amount: 1,
                    },
                    {
                        type: 'trash',
                        resource: 'card',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'Secrets': {
        agentIcon: 'bene_gesserit',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'intrigue',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'influence',
                        faction: 'bene_gesserit',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'Espionage': {
        agentIcon: 'bene_gesserit',
        playerAgents: [],
        options: [
            {
                cost: {
                    spice: 1,
                },
                rewards: [
                    {
                        type: 'gain',
                        resource: 'spy',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'card',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'influence',
                        faction: 'bene_gesserit',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'DeliverSupplies': {
        agentIcon: 'spacing_guild',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'water',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'influence',
                        faction: 'spacing_guild',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'Heighliner': {
        agentIcon: 'spacing_guild',
        playerAgents: [],
        options: [
            {
                cost: {
                    spice: 5
                },
                rewards: [
                    {
                        type: 'gain',
                        resource: 'troop',
                        amount: 5,
                    },
                    {
                        type: 'gain',
                        resource: 'influence',
                        faction: 'spacing_guild',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'DutifulService': {
        agentIcon: 'emperor',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'solari',
                        amount: 2,
                    },
                    {
                        type: 'gain',
                        resource: 'influence',
                        faction: 'emperor',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'Sardaukar': {
        agentIcon: 'emperor',
        playerAgents: [],
        options: [
            {
                cost: {
                    spice: 4,
                },
                rewards: [
                    {
                        type: 'gain',
                        resource: 'troop',
                        amount: 4,
                    },
                    {
                        type: 'gain',
                        resource: 'intrigue',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'influence',
                        faction: 'emperor',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'AcceptContract': {
        agentIcon: 'spice_trade',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'card',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'solari',
                        amount: 2,
                    }
                ]
            }
        ]
    },
    'Shipping': {
        agentIcon: 'spice_trade',
        playerAgents: [],
        options: [
            {
                cost: {
                    spice: 3
                },
                rewards: [
                    {
                        type: 'if',
                        condition: {
                            check: 'influenceAtLeast',
                            faction: 'spacing_guild',
                            value: 2,
                        },
                        then: [
                            {
                                type: 'gain',
                                resource: 'solari',
                                amount: 5,
                            },
                            {
                                type: 'gain',
                                resource: 'influence',
                                amount: 1,
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'AssemblyHall': {
        agentIcon: 'landsraad',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'intrigue',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'persuasion',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'GatherSupport': {
        agentIcon: 'landsraad',
        playerAgents: [],
        options: [
            {
                rewards: [
                    {
                        type: 'gain',
                        resource: 'troop',
                        amount: 2,
                    }
                ]
            },
            {
                cost: {
                    solari: 2,
                },
                rewards: [
                    {
                        type: 'gain',
                        resource: 'water',
                        amount: 1,
                    },
                    {
                        type: 'gain',
                        resource: 'troop',
                        amount: 2,
                    }
                ]
            }
        ]
    },
    'Swordmaster': {
        agentIcon: 'landsraad',
        playerAgents: [],
        options: [
            {
                cost: {
                    solari: 8
                },
                rewards: [
                    {
                        type: 'gain',
                        resource: 'swordmaster',
                        amount: 1,
                    }
                ]
            },
            {
                cost: {
                    solari: 6
                },
                rewards: [
                    {
                        type: 'gain',
                        resource: 'swordmaster',
                        amount: 1,
                    }
                ]
            }
        ]
    },
    'ImperialPrivilege': {
        agentIcon: 'landsraad',
        playerAgents: [],
        options: [
            {
                cost: {
                    solari: 3,
                },
                rewards: [
                    {
                        type: 'if',
                        condition: {
                            check: 'influenceAtLeast',
                            faction: 'emperor',
                            value: 2,
                        },
                        then: [
                            {
                                type: 'gain',
                                resource: 'recall',
                                amount: 1,
                            },
                            {
                                type: 'gain',
                                resource: 'card',
                                amount: 1,
                            },
                            {
                                type: 'trash',
                                resource: 'intrigue',
                                amount: 1,
                            },
                            {
                                type: 'gain',
                                resource: 'intrigue',
                                amount: 1,
                            }
                        ]
                    }
                ]
            }
        ]
    }
};