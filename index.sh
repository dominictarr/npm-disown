#! /bin/bash

rm () {

  npm owner add nopersonsmodules $1
  sleep 1
  npm owner rm $2 $1

}

ls () {
  npm access ls-packages $1 | grep -e '"(^["]+)":' -o
}

"$@"
