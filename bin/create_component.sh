#!/bin/bash

cd src
cd components
mkdir $1
cd $1
touch $1.controller.ts
touch $1.interfaces.ts
touch $1.model.ts
touch $1.routes.ts
touch $1.schemas.ts
touch $1.spec.ts
