# Explicacion Lab 14

## Describe cómo implementaste el patrón Store.

Para implementar el patrón Store centralizado, creé un archivo store.js donde declaré un objeto state que contiene el estado global de la aplicación, específicamente el arreglo plantillas.

En el store se usaron las siguientes funciones:

1. getState()
2. addPlantilla(plantilla) La cual agrega una nueva plantilla sin modificar el array original.
3. removePlantilla(id) La cual elimina una plantilla filtrando el array por ID.


## Explica qué cambios hiciste para mantener la inmutabilidad del estado.

Para mantener la inmutabilidad del estado:

1. Evité mutar el arreglo original de plantillas (state.plantillas) directamente.
2. Usé el operador spread ([...]) al agregar plantillas.
3. Al eliminar una plantilla, utilicé filter() para crear un nuevo arreglo.
4. En getState(), devolví una copia del estado en lugar del objeto original. 