export const contract = {
  "entries": {
    "cleanup": {
      "method": "post",
      "description": "Extract score name and author from raw string using AI",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "rawName": {
              "type": "string"
            }
          },
          "required": [
            "rawName"
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
            "author": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "author"
          ],
          "additionalProperties": false
        }
      }
    },
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
                  "id": {
                    "type": "string",
                    "format": "uuid",
                    "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                  },
                  "name": {
                    "type": "string"
                  },
                  "type": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "uuid",
                        "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "page_count": {
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
                  "is_favourite": {
                    "type": "boolean"
                  },
                  "collection": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "uuid",
                        "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "guitar_world_id": {
                    "anyOf": [
                      {
                        "type": "integer",
                        "minimum": -2147483648,
                        "maximum": 2147483647
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "created": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "updated": {
                    "type": "string",
                    "format": "date-time"
                  }
                },
                "required": [
                  "id",
                  "name",
                  "type",
                  "page_count",
                  "thumbnail",
                  "author",
                  "pdf",
                  "audio",
                  "musescore",
                  "is_favourite",
                  "collection",
                  "guitar_world_id",
                  "created",
                  "updated"
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
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "name": {
              "type": "string"
            },
            "type": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                {
                  "type": "null"
                }
              ]
            },
            "page_count": {
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
            "is_favourite": {
              "type": "boolean"
            },
            "collection": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                {
                  "type": "null"
                }
              ]
            },
            "guitar_world_id": {
              "anyOf": [
                {
                  "type": "integer",
                  "minimum": -2147483648,
                  "maximum": 2147483647
                },
                {
                  "type": "null"
                }
              ]
            },
            "created": {
              "type": "string",
              "format": "date-time"
            },
            "updated": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "name",
            "type",
            "page_count",
            "thumbnail",
            "author",
            "pdf",
            "audio",
            "musescore",
            "is_favourite",
            "collection",
            "guitar_world_id",
            "created",
            "updated"
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
        "NO_CONTENT": true
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
                  "id": {
                    "type": "string"
                  },
                  "name": {
                    "type": "string"
                  },
                  "icon": {
                    "type": "string"
                  },
                  "amount": {
                    "type": "number"
                  }
                },
                "required": [
                  "id",
                  "name",
                  "icon",
                  "amount"
                ],
                "additionalProperties": false
              }
            },
            "authors": {
              "type": "object",
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
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "name": {
              "type": "string"
            },
            "type": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                {
                  "type": "null"
                }
              ]
            },
            "page_count": {
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
            "is_favourite": {
              "type": "boolean"
            },
            "collection": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                {
                  "type": "null"
                }
              ]
            },
            "guitar_world_id": {
              "anyOf": [
                {
                  "type": "integer",
                  "minimum": -2147483648,
                  "maximum": 2147483647
                },
                {
                  "type": "null"
                }
              ]
            },
            "created": {
              "type": "string",
              "format": "date-time"
            },
            "updated": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "name",
            "type",
            "page_count",
            "thumbnail",
            "author",
            "pdf",
            "audio",
            "musescore",
            "is_favourite",
            "collection",
            "guitar_world_id",
            "created",
            "updated"
          ],
          "additionalProperties": false
        }
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
            "author"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "name": {
              "type": "string"
            },
            "type": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                {
                  "type": "null"
                }
              ]
            },
            "page_count": {
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
            "is_favourite": {
              "type": "boolean"
            },
            "collection": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                {
                  "type": "null"
                }
              ]
            },
            "guitar_world_id": {
              "anyOf": [
                {
                  "type": "integer",
                  "minimum": -2147483648,
                  "maximum": 2147483647
                },
                {
                  "type": "null"
                }
              ]
            },
            "created": {
              "type": "string",
              "format": "date-time"
            },
            "updated": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "name",
            "type",
            "page_count",
            "thumbnail",
            "author",
            "pdf",
            "audio",
            "musescore",
            "is_favourite",
            "collection",
            "guitar_world_id",
            "created",
            "updated"
          ],
          "additionalProperties": false
        }
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
            }
          },
          "required": [
            "name",
            "icon"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name",
            "icon"
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
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "icon": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              }
            },
            "required": [
              "id",
              "name",
              "icon",
              "amount"
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
        "NO_CONTENT": true
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
            }
          },
          "required": [
            "name",
            "icon"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name",
            "icon"
          ],
          "additionalProperties": false
        }
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
            }
          },
          "required": [
            "name"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
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
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              }
            },
            "required": [
              "id",
              "name",
              "amount"
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
        "NO_CONTENT": true
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
            }
          },
          "required": [
            "name"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
          ],
          "additionalProperties": false
        }
      }
    }
  }
} as const

export default contract
