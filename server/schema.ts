import z from 'zod'

const scoresLibrarySchemas = {
  entries: {
    schema: z.object({
      name: z.string(),
      type: z.string(),
      pageCount: z.string(),
      thumbnail: z.string(),
      author: z.string(),
      pdf: z.string(),
      audio: z.string(),
      musescore: z.string(),
      isFavourite: z.boolean(),
      collection: z.string(),
      guitar_world_id: z.number(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      id: '9agm22e3g44cdk8',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'scores_library__entries',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'cgqi62gp',
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          cascadeDelete: false,
          collectionId: 'pbc_960559984',
          hidden: false,
          id: 'relation2363381545',
          maxSelect: 1,
          minSelect: 0,
          name: 'type',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'vojkjqoz',
          max: 0,
          min: 0,
          name: 'pageCount',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'tb4by8gi',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: [],
          name: 'thumbnail',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: ['0x512'],
          type: 'file'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'cu4e2kos',
          max: 0,
          min: 0,
          name: 'author',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'hv0nhz4n',
          maxSelect: 1,
          maxSize: 52428800,
          mimeTypes: null,
          name: 'pdf',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: null,
          type: 'file'
        },
        {
          hidden: false,
          id: '0luzezpe',
          maxSelect: 1,
          maxSize: 52428800,
          mimeTypes: ['audio/mpeg'],
          name: 'audio',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: null,
          type: 'file'
        },
        {
          hidden: false,
          id: 'unlycjbb',
          maxSelect: 1,
          maxSize: 52428800,
          mimeTypes: null,
          name: 'musescore',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: null,
          type: 'file'
        },
        {
          hidden: false,
          id: 'zglxrk9r',
          name: 'isFavourite',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          cascadeDelete: false,
          collectionId: 'pbc_1328318918',
          hidden: false,
          id: 'relation4232930610',
          maxSelect: 1,
          minSelect: 0,
          name: 'collection',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          id: 'number3959456388',
          max: null,
          min: null,
          name: 'guitar_world_id',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          id: 'autodate2990389176',
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          id: 'autodate3332085495',
          name: 'updated',
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: 'autodate'
        }
      ],
      indexes: [],
      system: false
    }
  },
  authors_aggregated: {
    schema: z.object({
      name: z.string(),
      amount: z.number()
    }),
    raw: {
      id: 'pbc_1264004064',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'scores_library__authors_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text3208210256',
          max: 0,
          min: 0,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: '_clone_lxIs',
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'number2392944706',
          max: null,
          min: null,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        'SELECT\n  (ROW_NUMBER() OVER()) as id,\n  scores_library__entries.author as name,\n  COUNT(scores_library__entries.id) as amount\nFROM scores_library__entries\nGROUP BY scores_library__entries.author'
    }
  },
  types: {
    schema: z.object({
      name: z.string(),
      icon: z.string()
    }),
    raw: {
      id: 'pbc_960559984',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'scores_library__types',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text1579384326',
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text1704208859',
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        }
      ],
      indexes: [
        'CREATE UNIQUE INDEX `idx_WoBZ3EWAB2` ON `scores_library__types` (`name`)'
      ],
      system: false
    }
  },
  types_aggregated: {
    schema: z.object({
      name: z.string(),
      icon: z.string(),
      amount: z.number()
    }),
    raw: {
      id: 'pbc_1616642190',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'scores_library__types_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text3208210256',
          max: 0,
          min: 0,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: '_clone_woFF',
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: '_clone_9KW7',
          max: 0,
          min: 0,
          name: 'icon',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'number2392944706',
          max: null,
          min: null,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        'SELECT\n  scores_library__types.id,\n  scores_library__types.name,\n  scores_library__types.icon,\n  COUNT(scores_library__entries.id) as amount\nFROM scores_library__types\nLEFT JOIN scores_library__entries\n  ON scores_library__entries.type = scores_library__types.id\nGROUP BY scores_library__types.id'
    }
  },
  collections: {
    schema: z.object({
      name: z.string()
    }),
    raw: {
      id: 'pbc_1328318918',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'scores_library__collections',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text1579384326',
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        }
      ],
      indexes: [],
      system: false
    }
  },
  collections_aggregated: {
    schema: z.object({
      name: z.string(),
      amount: z.number()
    }),
    raw: {
      id: 'pbc_1931113261',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      name: 'scores_library__collections_aggregated',
      type: 'view',
      fields: [
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text3208210256',
          max: 0,
          min: 0,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: '_clone_wEP0',
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'number2392944706',
          max: null,
          min: null,
          name: 'amount',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        }
      ],
      indexes: [],
      system: false,
      viewQuery:
        'SELECT scores_library__collections.id,\n       scores_library__collections.name,\n       COUNT(scores_library__entries.id) as amount\nFROM scores_library__collections\nLEFT JOIN scores_library__entries\nON scores_library__entries.collection = scores_library__collections.id\nGROUP BY scores_library__collections.id'
    }
  }
}

export default scoresLibrarySchemas
