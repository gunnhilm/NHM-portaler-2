// UUIDene til NHMs dataset hos GBIF
// eslint-disable-next-line no-unused-vars
const GBifIdentifiers = {
    nhm: {
        Mammals : {
            source: 'corema',
            CatalogueNumber: 'NHMO-DMA-xxxxxx/x-T',
            OccurrenceID: 'urn:uuid:xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            key: '609217ee-054d-441d-a850-356cbc2fb385'
        },
        Herpetiles : {
            source: 'corema',
            CatalogueNumber: 'xxx-xx',
            OccurrenceID: 'urn:catalog:ZMO:Herp:',
            key: '0d8f74b3-42b9-488f-9ec1-1faefaff1d1c'
        },
        Fish: {
            source: 'corema',
            CatalogueNumber: 'xxx-xx',
            OccurrenceID: 'urn:catalog:ZMO:Pisc:',
            key: 'f0d00d00-aa57-4209-abaf-be2aed9a71dd'
        },
        Birds: {
            source: 'corema',
            CatalogueNumber: 'NHMO-BI-xxxxx/x-T | NHMO-BI-xxxxxx/x-E',
            OccurrenceID: 'urn:uuid:xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            key: '264e6a66-9c9e-4115-9aec-29d694c68097'
        },
        Algae : {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:O:A:',
            key: '7aa3a91c-eafe-44f5-adfb-d48fca1a3db5'
        },
        Entomolgy: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:NHMO:ENT:',
            key: '26f5b360-8770-4d54-9c2d-397798a5e513'
        },
        Mosses: {
            source: 'musit',
            CatalogueNumber: 'xxxxx/x',
            OccurrenceID: 'urn:catalog:O:B:',
            key: '68a0650f-96ae-499c-8b2a-a4f92c01e4b3'
        },
        Lichens: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:O:L:',
            key: '7948250c-6958-4a29-a670-ed1015b26252'
        },
        Vascular_plants: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:O:V:',
            key: 'e45c7d91-81c6-4455-86e3-2965a5739b1f'
        },
        Fungi: {
            source: 'musit',
            CatalogueNumber: 'xxxxx/x',
            OccurrenceID: 'urn:catalog:O:F:',
            key: 'e4deab67-0998-4140-b573-0ba1f624eb3e'
        }
    },
    um: {
        Entomology: {
            source: 'musit',
            CatalogueNumber: 'C-xxxxx',
            OccurrenceID: 'urn:catalog:ZMBN:',
            key: '6ce9819a-d82b-41e1-9059-0dd201f15993'
        },
        Mosses: {
            source: 'musit',
            CatalogueNumber: 'xxxxx/x',
            OccurrenceID: 'urn:catalog:BG:B:',
            key: 'ec1922d6-292e-4443-8bae-deba1092856b'
        },
        Lichens: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:BG:L:',
            key: 'fb1ecd28-f09e-4747-8bde-0b3d7a6f78d1'
        },
        Vascular_plants: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:BG:S:',
            key: '4db619a6-9429-4bef-90c9-06cc90c39552'
        },
        Fungi: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:BG:F:',
            key: '41690f55-ccbe-48ba-8238-01173f657072'
        },
        Gastropods: {
            source: 'musit',
            CatalogueNumber: 'ZMBN xxxxx',
            OccurrenceID: 'urn:catalog:BG:Gastropoda:',
            key: '7ccdcbd6-e559-4c71-ac50-59275ef592f3'
        },
        Invertebrates : {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:ZMBN:EVERT:',
            key: 'ce697b4c-7803-47d8-81bd-5a172f4960b5'
        }
    },
    tmu: {
        Entomology: {
            source: 'musit',
            CatalogueNumber: 'X-xxxxx',
            OccurrenceID: 'urn:catalog:TSZ:ENT:',
            key: 'f2a77c80-1e74-4c23-a3c9-c52cede89434'
        },
        Mosses: {
            source: 'musit',
            CatalogueNumber: 'xxxxx/x',
            OccurrenceID: 'urn:catalog:TROM:B:',
            key: '0f061eff-6854-4bb3-abe2-acb184ea3ab7'
        },
        Lichens: {
            source: 'musit',
            CatalogueNumber: 'xxxxx/1',
            OccurrenceID: 'urn:catalog:TROM:L:',
            key: 'e87a12af-fc4c-4315-bff7-c7b827379aca'
        },
        Vascular_plants: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:TROM:V:',
            key: 'd0aa984e-c6d3-45ee-8fc0-df1df8f4126b'
        },
        Fungi: {
            source: 'musit',
            CatalogueNumber: 'xxxxx/1',
            OccurrenceID: 'urn:catalog:TROM:F:',
            key: '374e0d4c-cf9f-4e1a-97a4-14123ee1bb7e'
        },
        Arthropoda: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: '	urn:catalog:TS:ZL:',
            key: 'ed527c71-23aa-40cf-b16b-1a5b8ec6770a'
        },
        Marine_invertebrates: {
            source: 'musit',
            CatalogueNumber: 'Y-xxxxx',
            OccurrenceID: 'urn:catalog:TSZ:EVERT:',
            key: 'b5a4d944-8a51-4104-a4a7-c3637128bcc7'
        }
    },
    vm: {
        Algae: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:TRH:A:',
            key: 'fb716825-2962-4375-8532-3ac7429aa86d'
        },
         Mosses: {
            source: 'musit',
            CatalogueNumber: 'xxxxx/x',
            OccurrenceID: 'urn:catalog:TRH:B:',
            key: '6728c42d-c4b6-4fda-a211-5ad1bb59cda4'
        },
        Lichens: {
            source: 'musit',
            CatalogueNumber: 'xxxxx/x',
            OccurrenceID: 'urn:catalog:TRH:L:',
            key: '78c1a71e-abb2-49cf-abc8-efafb981b0e4'
        },
        Vascular_plants: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:TRH:V:',
            key: 'd29d79fd-2dc4-4ef5-89b8-cdf66994de0d'
        },
        Fungi: {
            source: 'musit',
            CatalogueNumber: 'xxxxx/x',
            OccurrenceID: 'urn:catalog:TRH:F:',
            key: '7eb54e10-fd36-4139-8764-1fd8abc2bd67'
        },
        Terrestrial_invertebrates: {
            source: 'musit',
            CatalogueNumber: 'DRY-xxxxx | WET-xxxxx',
            OccurrenceID: 'urn:uuid:',
            key: '1bec5de3-758c-4ed2-ab13-1597601ad07a'
        },
        Marine_invertebrates: {
            source: 'musit',
            CatalogueNumber: 'DRY-xxxxx | WET-xxxxx',
            OccurrenceID: 'urn:uuid:',
            key: 'ead6339f-39f8-46be-b059-d1c48d88ab29'
        },
        Birds: {
            source: 'musit',
            CatalogueNumber: 'BIRD-xxxx-Cranium | BIRD-xxxx-Skeleton',
            OccurrenceID: 'urn:uuid:',
            key: 'c6a2ecf7-f9d2-4443-91b6-199f00aa01a2'
        },
        Fish: {
            source: 'musit',
            CatalogueNumber: 'DRY-xxxxx | WET-xxxxx',
            OccurrenceID: 'urn:uuid:',
            key: '81ccd65e-1832-4d4c-aaaa-56541b71ae1b'
        },
        Mammals: {
            source: 'musit',
            CatalogueNumber: 'DRY-xxxxx',
            OccurrenceID: 'urn:uuid:',
            key: '44ff990f-945e-4b37-9060-fc7de856b1ea'
        },
        Herpetiles: {
            source: 'musit',
            CatalogueNumber: 'DRY-xxxxx',
            OccurrenceID: 'urn:uuid:',
            key: 'fcb19622-6d6d-470f-9371-86e1210f9ee3'
        }
    },
    nbh: {
        Algae: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:KMN:A:',
            key: 'f60aa56f-cbb7-4f55-8a6d-67288d5ba9b1'
        },      
        Vascular_plants: {
            source: 'musit',
            CatalogueNumber: 'xxxxx',
            OccurrenceID: 'urn:catalog:KMN:V:',
            key: '30bc94f2-50aa-4688-8e87-a8e11d3d69ff'
        }
    }
}