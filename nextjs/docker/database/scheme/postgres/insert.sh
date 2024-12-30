#!/usr/bin/env bash
authjs=`cat "1. authjs.sql"`
reporting=`cat "2. reporting.sql"`
data=`cat "3. data.sql"`
echo "$value"
psql -c "$authjs"
psql -c "$reporting"
psql -c "$data"
echo "done inserting"