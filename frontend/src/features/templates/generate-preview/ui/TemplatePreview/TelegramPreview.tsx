import {FC, useState} from 'react';
import {ITemplatePreviewProps} from './TemplatePreview';
import {Alert, Button, Dialog, Flex, TextInput} from '@gravity-ui/uikit';
import {FormRow} from '@/shared/ui';
import {useSendMessageToChat} from '@/entities/templates/api/queryHook';

export const TelegramPreview: FC<ITemplatePreviewProps> = ({content}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatId, setChatId] = useState('');

    const {mutate} = useSendMessageToChat();
    return (
        <>
            <Alert
                theme="warning"
                message="Для предпросмотра сообщения воспользуйтесь тестовой отправкой шаблона"
                actions={
                    <Button view="outlined" disabled={!content} onClick={() => setIsOpen(true)}>
                        Отправить тестовое сообщение
                    </Button>
                }
            />
            <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen((p) => !p);
                    setChatId('');
                }}
            >
                <Dialog.Header caption="Отправка сообщения в бота" />
                <Dialog.Body>
                    <Flex width={'100%'} direction="column" gap={2}>
                        <Alert
                            theme="info"
                            message="Для получения chatId напишите в бота команду /chatId"
                        />
                        <FormRow label="ChatId">
                            {() => <TextInput value={chatId} onUpdate={setChatId} />}
                        </FormRow>
                    </Flex>
                </Dialog.Body>
                <Dialog.Footer
                    textButtonApply="Отправить"
                    onClickButtonApply={() => {
                        mutate({
                            chatId,
                            message: content!,
                        });
                    }}
                />
            </Dialog>
        </>
    );
};
