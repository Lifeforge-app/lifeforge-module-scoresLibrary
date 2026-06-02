export const contract = {
  "entries": {
    "list": {
      "method": "get",
      "description": "Get scores with filters and pagination",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "page": {
              "default": "1",
              "type": "string"
            },
            "query": {
              "type": "string"
            },
            "category": {
              "type": "string"
            },
            "author": {
              "type": "string"
            },
            "collection": {
              "type": "string"
            },
            "starred": {
              "type": "string"
            },
            "sort": {
              "default": "newest",
              "type": "string",
              "enum": [
                "name",
                "author",
                "newest",
                "oldest"
              ]
            }
          },
          "required": [
            "page",
            "sort"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "type": {
                    "type": "string"
                  },
                  "pageCount": {
                    "type": "string"
                  },
                  "thumbnail": {
                    "type": "string"
                  },
                  "author": {
                    "type": "string"
                  },
                  "pdf": {
                    "type": "string"
                  },
                  "audio": {
                    "type": "string"
                  },
                  "musescore": {
                    "type": "string"
                  },
                  "isFavourite": {
                    "type": "boolean"
                  },
                  "collection": {
                    "type": "string"
                  },
                  "guitar_world_id": {
                    "type": "number"
                  },
                  "created": {
                    "type": "string"
                  },
                  "updated": {
                    "type": "string"
                  },
                  "id": {
                    "type": "string"
                  },
                  "collectionId": {
                    "type": "string"
                  },
                  "collectionName": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "type",
                  "pageCount",
                  "thumbnail",
                  "author",
                  "pdf",
                  "audio",
                  "musescore",
                  "isFavourite",
                  "collection",
                  "guitar_world_id",
                  "created",
                  "updated",
                  "id",
                  "collectionId",
                  "collectionName"
                ],
                "additionalProperties": false
              }
            },
            "page": {
              "type": "number"
            },
            "perPage": {
              "type": "number"
            },
            "totalItems": {
              "type": "number"
            },
            "totalPages": {
              "type": "number"
            }
          },
          "required": [
            "items",
            "page",
            "perPage",
            "totalItems",
            "totalPages"
          ],
          "additionalProperties": false
        }
      }
    },
    "random": {
      "method": "get",
      "description": "Get a random score",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "pageCount": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            },
            "author": {
              "type": "string"
            },
            "pdf": {
              "type": "string"
            },
            "audio": {
              "type": "string"
            },
            "musescore": {
              "type": "string"
            },
            "isFavourite": {
              "type": "boolean"
            },
            "collection": {
              "type": "string"
            },
            "guitar_world_id": {
              "type": "number"
            },
            "created": {
              "type": "string"
            },
            "updated": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "type",
            "pageCount",
            "thumbnail",
            "author",
            "pdf",
            "audio",
            "musescore",
            "isFavourite",
            "collection",
            "guitar_world_id",
            "created",
            "updated",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a score",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true,
        "NOT_FOUND": true
      }
    },
    "sidebarData": {
      "method": "get",
      "description": "Get sidebar statistics and filters",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "total": {
              "type": "number"
            },
            "favourites": {
              "type": "number"
            },
            "types": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "icon": {
                    "type": "string"
                  },
                  "amount": {
                    "type": "number"
                  },
                  "id": {
                    "type": "string"
                  },
                  "collectionId": {
                    "type": "string"
                  },
                  "collectionName": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "icon",
                  "amount",
                  "id",
                  "collectionId",
                  "collectionName"
                ],
                "additionalProperties": false
              }
            },
            "authors": {
              "type": "object",
              "propertyNames": {
                "type": "string"
              },
              "additionalProperties": {
                "type": "number"
              }
            }
          },
          "required": [
            "total",
            "favourites",
            "types",
            "authors"
          ],
          "additionalProperties": false
        }
      }
    },
    "toggleFavourite": {
      "method": "post",
      "description": "Toggle favourite status",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "pageCount": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            },
            "author": {
              "type": "string"
            },
            "pdf": {
              "type": "string"
            },
            "audio": {
              "type": "string"
            },
            "musescore": {
              "type": "string"
            },
            "isFavourite": {
              "type": "boolean"
            },
            "collection": {
              "type": "string"
            },
            "guitar_world_id": {
              "type": "number"
            },
            "created": {
              "type": "string"
            },
            "updated": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "type",
            "pageCount",
            "thumbnail",
            "author",
            "pdf",
            "audio",
            "musescore",
            "isFavourite",
            "collection",
            "guitar_world_id",
            "created",
            "updated",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update score details",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "author": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "collection": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "author",
            "type"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "pageCount": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            },
            "author": {
              "type": "string"
            },
            "pdf": {
              "type": "string"
            },
            "audio": {
              "type": "string"
            },
            "musescore": {
              "type": "string"
            },
            "isFavourite": {
              "type": "boolean"
            },
            "collection": {
              "type": "string"
            },
            "guitar_world_id": {
              "type": "number"
            },
            "created": {
              "type": "string"
            },
            "updated": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "type",
            "pageCount",
            "thumbnail",
            "author",
            "pdf",
            "audio",
            "musescore",
            "isFavourite",
            "collection",
            "guitar_world_id",
            "created",
            "updated",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    },
    "upload": {
      "method": "post",
      "description": "Upload score files",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "files": {
          "optional": false,
          "multiple": true
        }
      },
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    }
  },
  "guitarWorld": {
    "download": {
      "method": "post",
      "description": "Download tab from Guitar World",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "cookie": {
              "type": "string"
            },
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "category": {
              "type": "string"
            },
            "mainArtist": {
              "type": "string"
            },
            "audioUrl": {
              "type": "string"
            }
          },
          "required": [
            "cookie",
            "id",
            "name",
            "category",
            "mainArtist",
            "audioUrl"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        },
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    },
    "list": {
      "method": "get",
      "description": "Get tabs from Guitar World",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "cookie": {
              "type": "string"
            },
            "page": {
              "default": "1",
              "type": "string"
            }
          },
          "required": [
            "cookie",
            "page"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "number"
                  },
                  "name": {
                    "type": "string"
                  },
                  "subtitle": {
                    "type": "string"
                  },
                  "category": {
                    "type": "string"
                  },
                  "mainArtist": {
                    "type": "string"
                  },
                  "uploader": {
                    "type": "string"
                  },
                  "audioUrl": {
                    "type": "string"
                  },
                  "existed": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "name",
                  "subtitle",
                  "category",
                  "mainArtist",
                  "uploader",
                  "audioUrl",
                  "existed"
                ],
                "additionalProperties": false
              }
            },
            "totalItems": {
              "type": "number"
            },
            "perPage": {
              "type": "number"
            }
          },
          "required": [
            "data",
            "totalItems",
            "perPage"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "types": {
    "create": {
      "method": "post",
      "description": "Create a new score type",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      }
    },
    "list": {
      "method": "get",
      "description": "Get all music score types",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "icon": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              },
              "id": {
                "type": "string"
              },
              "collectionId": {
                "type": "string"
              },
              "collectionName": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "icon",
              "amount",
              "id",
              "collectionId",
              "collectionName"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a score type",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true,
        "NOT_FOUND": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update score type details",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    }
  },
  "collections": {
    "create": {
      "method": "post",
      "description": "Create a new score collection",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      }
    },
    "list": {
      "method": "get",
      "description": "Get all score collections",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              },
              "id": {
                "type": "string"
              },
              "collectionId": {
                "type": "string"
              },
              "collectionName": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "amount",
              "id",
              "collectionId",
              "collectionName"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a score collection",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true,
        "NOT_FOUND": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update collection details",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "NOT_FOUND": true
      }
    }
  }
} as const

export default contract
