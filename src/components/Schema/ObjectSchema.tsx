import * as React from 'react';
import { observer } from 'mobx-react';

import { SchemaModel, FieldModel } from '../../services/models';

import { Field } from '../Fields/Field';
import { DiscriminatorDropdown } from './DiscriminatorDropdown';
import { Schema, SchemaProps } from './Schema';
import {
  InnerPropertiesWrap,
  PropertiesTable,
  PropertiesTableCaption,
  PropertyCellWithInner,
} from '../../common-elements/fields-layout';

import { mapWithLast } from '../../utils';

export interface ObjectSchemaProps extends SchemaProps {
  discriminator?: {
    fieldName: string;
    parentSchema: SchemaModel;
  };
}

@observer
export class ObjectSchema extends React.Component<ObjectSchemaProps> {
  get parentSchema() {
    return this.props.discriminator!.parentSchema;
  }

  renderField(field: FieldModel, isLast: boolean, isDiscriminator: boolean = false) {
    const withSubSchema = !field.schema.isPrimitive && !field.schema.isCircular;
    return [
      <Field
        key={field.name}
        isLast={isLast}
        field={field}
        onClick={(withSubSchema && (() => field.toggle())) || undefined}
        renderDiscriminatorSwitch={
          (isDiscriminator &&
            (() => (
              <DiscriminatorDropdown parent={this.parentSchema} enumValues={field.schema.enum} />
            ))) ||
          undefined
        }
        className={field.expanded ? 'expanded' : undefined}
        showExamples={false}
      />,
      field.expanded &&
        withSubSchema && (
          <tr key={field.name + 'inner'}>
            <PropertyCellWithInner colSpan={2}>
              <InnerPropertiesWrap>
                <Schema schema={field.schema} />
              </InnerPropertiesWrap>
            </PropertyCellWithInner>
          </tr>
        ),
    ];
  }

  render() {
    const { schema: { fields = [] }, showTitle, discriminator } = this.props;

    return (
      <PropertiesTable>
        {showTitle && <PropertiesTableCaption>{this.props.schema.title}</PropertiesTableCaption>}
        <tbody>
          {mapWithLast(fields, (field, isLast) =>
            this.renderField(
              field,
              isLast,
              discriminator && discriminator.fieldName === field.name,
            ),
          )}
        </tbody>
      </PropertiesTable>
    );
  }
}