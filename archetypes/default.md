+++
date = '{{ .Date.Format "2006-01-02T15:04:05" }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
+++
