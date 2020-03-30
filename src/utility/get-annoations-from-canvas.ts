import {AnnotationList, Canvas} from 'manifesto.js';

export async function getAnnotationsFromCanvas(canvas: Canvas) {
  const annotationProperty = canvas.getProperty('annotations');
  if (!annotationProperty) {
    return Promise.resolve([]);
  }

  const annotations = Array.isArray(annotationProperty)
    ? annotationProperty
    : [annotationProperty];

  const annotationPromises: Promise<AnnotationList>[] = annotations
    .map(
      (annotationList, i) =>
        new AnnotationList(
          annotationList.label || `Annotation list ${i}`,
          annotationList,
          canvas.options
        )
    )
    .map(annotationList => annotationList.load());

  return Promise.all(annotationPromises);
}