#!/bin/bash
./node_modules/.bin/babel-node src/index indices.del --index certicat-main-idx
./node_modules/.bin/babel-node src/index indices.create --index certicat-main-idx
 ./node_modules/.bin/babel-node src/index indices.tmpl.put --name certicat_template --template certicat-* --mappings_dir ../certicat/mappings --settings '{"analysis": {"analyzer": {"paths": {"tokenizer": "path_hierarchy"}}}}'
 ./node_modules/.bin/babel-node src/index tmpl.putBulk --dir ../certicat/queries
./node_modules/.bin/babel-node src/index docs.createBulk --dir ../certicat/init_data/app --index certicat-main-idx