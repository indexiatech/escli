# Es-Cli

An handy tool for performing Elastic Search operations via the CLI.

# TODO

- It could be nice if it would be possible to invoke createBulk that tries to create & if fails try to put, as it seems, put
can't create.

## Commands

- Count - https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-count-2-1
- docs.update - Support update via script
- mget - Get multiple docs at once
  https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-mget-2-1
- searchExists - Check if a document exist.
  https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-1.html#api-searchexists-2-1
- msearch
- searchTemplate via inline (by file)