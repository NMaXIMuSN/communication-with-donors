import {Flex, Text} from '@gravity-ui/uikit';
import {FC, PropsWithChildren, ReactNode} from 'react';

interface IExtraTag {
    value: string | ReactNode;
    label: string;
}

interface IProps {
    title: string;
    extraTags?: IExtraTag[];
    description?: string;
}
export const EntityPage: FC<IProps & PropsWithChildren> = (props) => {
    const {title, extraTags, description, children} = props;

    return (
        <div>
            <Flex direction="column" gap={2} spacing={{mb: 8}}>
                <Text variant="subheader-3">{title}</Text>

                {extraTags && (
                    <Flex gap={2} wrap>
                        {extraTags.map((tag, index) => (
                            <Flex gap={1} key={index}>
                                <Text color="secondary">{tag.label}:</Text>
                                <Text>{tag.value}</Text>
                            </Flex>
                        ))}
                    </Flex>
                )}

                {description && <Text variant="body-2">{description}</Text>}
            </Flex>
            <div>{children}</div>
        </div>
    );
};
