#!/usr/bin/env bash
authjs=`cat "1. authjs.sql"`
reporting=`cat "2. reporting.sql"`
invoices=`cat "3. invoices.sql"`
data=`cat "4. data.sql"`
echo "$value"
echo "insert authjs"
psql -c "$authjs"
echo "insert reporting"
psql -c "$reporting"
echo "insert invoices"
psql -c "$invoices"
echo "insert data"
psql -c "$data"
echo "done inserting"