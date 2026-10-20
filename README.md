# Distributed Tracing Example

This repository contains the base code to implement Tracing observability with `OpenTelemetry`

Check the Grafana guide for more info:
(https://grafana.com/blog/2021/09/23/intro-to-distributed-tracing-with-tempo-opentelemetry-and-grafana-cloud/)


## Traza de error 
![alt text](img/image.png)
![alt text](img/image-1.png)
![alt text](img/image-2.png)

### 3.3 - Observa las trazas que se generan en Tempo. ¿Cuál es el ratio de fallos que nos estamos encontrando en el microservicio dogs? ¿Cuántas peticiones por segundo estamos generando con K6? ¿Cuál es el cuello de botella de la aplicación?

![alt text](img/image-3.png)

El error rate es de 29.08 (siendo el ratio 41.52)

Se estan generando aproximadamente 30 iteraciones por segundo

Aparte del problema de errores. La traza muestra que middleware-anonymous dura unos 232 ms porque engloba llamadas a /inventory y /dogs de unos 100 ms cada una

![alt text](img/image-4.png)


## Reto 1

![alt text](img/image-5.png)

## Reto 2

![alt text](img/image-6.png)

La indisponibilidad que aparece en UPCSchool es controlada. Se ha provocado deshabilitando el internet desde la máquina host.

## Full stack:
![alt text](img/image-7.png)