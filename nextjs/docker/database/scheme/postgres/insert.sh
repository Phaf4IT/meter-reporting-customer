#!/usr/bin/env bash
authjs=`cat "1. authjs.sql"`
reporting=`cat "2. reporting.sql"`
invoices=`cat "3. invoices.sql"`
data=`cat "4. data.sql"`
echo "$value"
psql -c "$authjs"
psql -c "$reporting"
psql -c "$invoices"
psql -c "$data"
echo "done inserting"